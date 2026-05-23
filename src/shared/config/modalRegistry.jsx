import { MODAL_TYPES } from '@/shared/constants/modals'
import { ConfirmModal } from '@/presentation/components/modals/ConfirmModal/ConfirmModal'
import { ExampleModal } from '@/presentation/components/modals/ExampleModal/ExampleModal'

export const modalRegistry = {
  [MODAL_TYPES.CONFIRM]: ConfirmModal,
  [MODAL_TYPES.EXAMPLE]: ExampleModal,
}
