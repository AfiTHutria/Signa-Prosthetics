import * as THREE from 'three'

export const COLORS = {
  white: 0xf2f2f2,
  carbon: 0x1a1a1a,
  silver: 0xa6a6a6,
  gold: 0xb89356,
  cyan: 0x5eead4,
  skin: 0xe8c4a8,
}

export function matWhite() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.white,
    metalness: 0.08,
    roughness: 0.55,
  })
}

export function matCarbon() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.carbon,
    metalness: 0.35,
    roughness: 0.45,
  })
}

export function matChrome() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.silver,
    metalness: 0.92,
    roughness: 0.18,
  })
}

export function matGold() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    metalness: 0.75,
    roughness: 0.32,
  })
}

export function matSkin() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.skin,
    metalness: 0.05,
    roughness: 0.72,
  })
}

export function matScreen() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.cyan,
    emissive: COLORS.cyan,
    emissiveIntensity: 0.85,
    metalness: 0.2,
    roughness: 0.4,
  })
}
