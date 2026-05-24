import {
  ConnectionState,
  DataPacket_Kind,
  DisconnectReason,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { COMPANION_DATA_TOPIC } from '@/shared/constants/livekit'
import { isAgentParticipant } from '@/infrastructure/livekit/agentUtils'

/**
 * Cliente LiveKit siguiendo el flujo: crear Room → eventos → connect → medios → cleanup.
 */
export class LiveKitClient {
  /** @type {Room | null} */
  room = null

  /** @type {Map<string, import('livekit-client').RemoteParticipant>} */
  remoteParticipants = new Map()

  /** @type {((track: import('livekit-client').RemoteTrack, el?: HTMLMediaElement) => void) | null} */
  onRemoteVideoTrack = null

  /** @type {((payload: object, participant?: import('livekit-client').Participant) => void) | null} */
  onDataMessage = null

  /** @type {((state: ConnectionState) => void) | null} */
  onConnectionStateChange = null

  /** @type {((agent: import('livekit-client').RemoteParticipant | null) => void) | null} */
  onAgentChange = null

  /** @type {((state: string | null) => void) | null} */
  onAgentStateChange = null

  /** @type {((segment: { id?: string; text?: string; final?: boolean }, participant?: import('livekit-client').Participant) => void) | null} */
  onTranscription = null

  /** @type {((blocked: boolean) => void) | null} */
  onAudioPlaybackChange = null

  /** @type {((reason?: DisconnectReason) => void) | null} */
  onDisconnected = null

  get isConnected() {
    return this.room?.state === ConnectionState.Connected
  }

  get localParticipant() {
    return this.room?.localParticipant ?? null
  }

  get activeAgent() {
    if (!this.room) return null
    for (const p of this.room.remoteParticipants.values()) {
      if (isAgentParticipant(p)) return p
    }
    return null
  }

  get canPlaybackAudio() {
    return this.room?.canPlaybackAudio ?? true
  }

  /**
   * @param {object} handlers
   */
  setHandlers(handlers) {
    if (handlers.onRemoteVideoTrack !== undefined) {
      this.onRemoteVideoTrack = handlers.onRemoteVideoTrack
    }
    if (handlers.onDataMessage !== undefined) {
      this.onDataMessage = handlers.onDataMessage
    }
    if (handlers.onConnectionStateChange !== undefined) {
      this.onConnectionStateChange = handlers.onConnectionStateChange
    }
    if (handlers.onAgentChange !== undefined) {
      this.onAgentChange = handlers.onAgentChange
    }
    if (handlers.onAgentStateChange !== undefined) {
      this.onAgentStateChange = handlers.onAgentStateChange
    }
    if (handlers.onTranscription !== undefined) {
      this.onTranscription = handlers.onTranscription
    }
    if (handlers.onAudioPlaybackChange !== undefined) {
      this.onAudioPlaybackChange = handlers.onAudioPlaybackChange
    }
    if (handlers.onDisconnected !== undefined) {
      this.onDisconnected = handlers.onDisconnected
    }
  }

  createRoom() {
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
    })
    this.bindRoomEvents()
    return this.room
  }

  bindRoomEvents() {
    if (!this.room) return

    this.room
      .on(RoomEvent.Connected, () => {
        this.syncParticipants()
        this.notifyAgent()
        this.onConnectionStateChange?.(ConnectionState.Connected)
      })
      .on(RoomEvent.Disconnected, (reason) => {
        this.remoteParticipants.clear()
        this.onConnectionStateChange?.(ConnectionState.Disconnected)
        this.onDisconnected?.(reason)
      })
      .on(RoomEvent.ConnectionStateChanged, (state) => {
        this.onConnectionStateChange?.(state)
      })
      .on(RoomEvent.Reconnecting, () => {
        this.onConnectionStateChange?.(ConnectionState.Reconnecting)
      })
      .on(RoomEvent.Reconnected, () => {
        this.syncParticipants()
        this.notifyAgent()
        this.onConnectionStateChange?.(ConnectionState.Connected)
      })
      .on(RoomEvent.ParticipantConnected, (participant) => {
        this.remoteParticipants.set(participant.identity, participant)
        if (isAgentParticipant(participant)) {
          this.onAgentChange?.(participant)
          this.emitAgentState(participant)
        }
      })
      .on(RoomEvent.ParticipantDisconnected, (participant) => {
        this.remoteParticipants.delete(participant.identity)
        if (isAgentParticipant(participant)) {
          this.onAgentChange?.(this.activeAgent)
          if (!this.activeAgent) this.onAgentStateChange?.(null)
        }
      })
      .on(RoomEvent.ParticipantActive, (participant) => {
        if (isAgentParticipant(participant)) {
          this.onAgentChange?.(participant)
          this.emitAgentState(participant)
        }
      })
      .on(RoomEvent.ParticipantAttributesChanged, (_changed, participant) => {
        if (isAgentParticipant(participant)) this.emitAgentState(participant)
      })
      .on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        this.handleTrackSubscription(track, participant)
      })
      .on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach()
      })
      .on(RoomEvent.DataReceived, (payload, participant, _kind, topic) => {
        const fromAgent = isAgentParticipant(participant)
        if (!fromAgent && topic && topic !== COMPANION_DATA_TOPIC) return
        try {
          const message = JSON.parse(new TextDecoder().decode(payload))
          this.onDataMessage?.(message, participant)
        } catch {
          if (fromAgent) {
            const text = new TextDecoder().decode(payload).trim()
            if (text) {
              this.onDataMessage?.(
                { type: 'chat', message: text, from: 'assistant', timestamp: Date.now() },
                participant,
              )
            }
          }
        }
      })
      .on(RoomEvent.ChatMessage, (message, participant) => {
        if (!message?.message || participant?.isLocal) return
        if (isAgentParticipant(participant)) {
          this.onDataMessage?.(
            {
              type: 'chat',
              message: message.message,
              from: 'assistant',
              timestamp: message.timestamp ?? Date.now(),
            },
            participant,
          )
        }
      })
      .on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        if (!participant || participant.isLocal) return
        if (!isAgentParticipant(participant)) return
        for (const segment of segments) {
          if (segment?.text) this.onTranscription?.(segment, participant)
        }
      })
      .on(RoomEvent.AudioPlaybackStatusChanged, () => {
        this.onAudioPlaybackChange?.(!this.room?.canPlaybackAudio)
      })
  }

  /**
   * @param {import('livekit-client').Participant} participant
   */
  emitAgentState(participant) {
    const state = participant.attributes?.['lk.agent.state'] ?? null
    this.onAgentStateChange?.(state)
  }

  /**
   * @param {import('livekit-client').RemoteTrack} track
   * @param {import('livekit-client').RemoteParticipant} participant
   */
  handleTrackSubscription(track, participant) {
    if (track.kind === Track.Kind.Audio) {
      const audioEl = track.attach()
      if (audioEl) {
        audioEl.autoplay = true
        audioEl.muted = false
      }
      return
    }
    if (track.kind === Track.Kind.Video && isAgentParticipant(participant)) {
      const containerId = 'agent-video'
      let el = document.getElementById(containerId)
      if (!el) {
        el = document.createElement('video')
        el.id = containerId
        el.autoplay = true
        el.playsInline = true
        el.muted = false
      }
      track.attach(el)
      this.onRemoteVideoTrack?.(track, el)
    }
  }

  syncParticipants() {
    if (!this.room) return
    this.remoteParticipants = new Map(
      [...this.room.remoteParticipants.entries()].map(([k, v]) => [k, v]),
    )
  }

  notifyAgent() {
    const agent = this.activeAgent
    this.onAgentChange?.(agent)
    if (agent) this.emitAgentState(agent)
  }

  /**
   * @param {string} serverUrl
   * @param {string} token
   */
  async connect(serverUrl, token) {
    if (!this.room) this.createRoom()

    try {
      await this.room.connect(serverUrl, token)
    } catch (err) {
      const msg = err?.message ?? String(err)
      if (msg.includes('not allowed')) {
        throw new Error('Token inválido o expirado. Solicita uno nuevo.')
      }
      if (msg.toLowerCase().includes('connection')) {
        throw new Error('No se pudo conectar a LiveKit. Revisa red y VITE_LIVEKIT_URL.')
      }
      throw err
    }
  }

  async startAudio() {
    await this.room?.startAudio()
  }

  /** Publica micrófono (y cámara si el usuario lo permite) */
  async enableMedia() {
    try {
      await this.room?.localParticipant.enableCameraAndMicrophone()
    } catch {
      try {
        await this.room?.localParticipant.setMicrophoneEnabled(true)
      } catch {
        /* la sesión sigue; el agente puede escuchar cuando haya permiso */
      }
    }
  }

  async enableCameraAndMicrophone() {
    return this.enableMedia()
  }

  /** Solo micrófono (entrevista de voz, sin cámara) */
  async enableMicrophoneOnly() {
    await this.startAudio()
    await this.room?.localParticipant.setMicrophoneEnabled(true)
    await this.room?.localParticipant.setCameraEnabled(false)
  }

  attachLocalVideo(element) {
    const pub = this.room?.localParticipant.getTrackPublication(Track.Source.Camera)
    const track = pub?.videoTrack
    if (track && element) track.attach(element)
  }

  async setMicrophoneEnabled(enabled) {
    await this.room?.localParticipant.setMicrophoneEnabled(enabled)
  }

  async setCameraEnabled(enabled) {
    await this.room?.localParticipant.setCameraEnabled(enabled)
  }

  /**
   * @param {object} payload
   */
  async publishCompanionData(payload) {
    const data = new TextEncoder().encode(JSON.stringify(payload))
    await this.room?.localParticipant.publishData(data, {
      reliable: true,
      topic: COMPANION_DATA_TOPIC,
    })
  }

  /** Envía texto al agente por el canal estándar de LiveKit */
  async sendTextToRoom(text) {
    await this.room?.localParticipant.sendText(text)
  }

  disconnect() {
    this.room?.disconnect()
    this.room = null
    this.remoteParticipants.clear()
  }
}

export { ConnectionState, DisconnectReason, DataPacket_Kind, Track, RoomEvent }
