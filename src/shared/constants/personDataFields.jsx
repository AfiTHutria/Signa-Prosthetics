import { CARLOS_PERSON_DATA } from '@/services/report/reportToPersonData'

export const PERSON_DATA_SECTIONS = [
  {
    id: 'personal',
    title: 'Datos personales',
    fields: [
      { id: 'fullName', label: 'Nombre completo', placeholder: 'Ej. Carlos Mendoza López', type: 'text' },
      { id: 'document', label: 'Documento de identidad', placeholder: 'Ej. CC 1.045.892.103', type: 'text' },
      { id: 'email', label: 'Correo electrónico', placeholder: 'correo@ejemplo.com', type: 'email' },
      { id: 'phone', label: 'Teléfono / WhatsApp', placeholder: '+57 310 456 7890', type: 'tel' },
      { id: 'age', label: 'Edad', placeholder: 'Ej. 34', type: 'number' },
      { id: 'city', label: 'Ciudad de residencia', placeholder: 'Ej. Medellín', type: 'text' },
    ],
  },
  {
    id: 'amputation',
    title: 'Información de amputación',
    fields: [
      { id: 'amputationType', label: 'Tipo de amputación', placeholder: 'Transtibial, transradial…', type: 'text' },
      { id: 'side', label: 'Lateralidad', placeholder: 'Izquierda / Derecha', type: 'text' },
      { id: 'amputationDate', label: 'Tiempo desde amputación', placeholder: 'Ej. 2 años', type: 'text' },
      { id: 'cause', label: 'Causa', placeholder: 'Traumática, congénita, médica…', type: 'text' },
      { id: 'stumpCondition', label: 'Estado del muñón', placeholder: 'Dolor, piel, sensibilidad…', type: 'textarea' },
    ],
  },
  {
    id: 'activity',
    title: 'Rutina y actividad',
    fields: [
      { id: 'activityLevel', label: 'Nivel de actividad', placeholder: 'Moderado, sedentario…', type: 'text' },
      { id: 'sports', label: 'Actividades prioritarias', placeholder: 'Caminar, escaleras, transporte…', type: 'text' },
      { id: 'dailyUse', label: 'Uso diario esperado', placeholder: 'Horas y objetivo principal', type: 'text' },
      { id: 'workEnvironment', label: 'Entorno', placeholder: 'Clima, terreno, transporte…', type: 'text' },
    ],
  },
  {
    id: 'prosthetic',
    title: 'Preferencias de prótesis',
    fields: [
      { id: 'prostheticType', label: 'Tipo de prótesis deseada', placeholder: 'Transtibial deportiva…', type: 'text' },
      { id: 'material', label: 'Material preferido', placeholder: 'Fibra de carbono…', type: 'text' },
      { id: 'functions', label: 'Prioridades', placeholder: 'Comodidad, resistencia…', type: 'textarea' },
      { id: 'aesthetic', label: 'Preferencias estéticas', placeholder: 'Discreta / natural', type: 'text' },
    ],
  },
  {
    id: 'clinical',
    title: 'Información clínica',
    fields: [
      { id: 'doctor', label: 'Médico / ortopedista', placeholder: 'Nombre del profesional tratante', type: 'text' },
      { id: 'institution', label: 'Centro de rehabilitación', placeholder: 'Clínica o IPS', type: 'text' },
      { id: 'allergies', label: 'Alergias o sensibilidades', placeholder: 'Materiales, adhesivos…', type: 'text' },
      { id: 'notes', label: 'Preocupaciones y expectativas', placeholder: 'Dolor prolongado, independencia laboral…', type: 'textarea' },
    ],
  },
  {
    id: 'measurements',
    title: 'Medidas (si las tienes)',
    fields: [
      { id: 'stumpLength', label: 'Longitud del muñón (cm)', placeholder: 'Ej. 20', type: 'number' },
      { id: 'stumpCircumference', label: 'Circunferencia del muñón (cm)', placeholder: 'Ej. 27', type: 'number' },
      { id: 'dominantSide', label: 'Miembro dominante', placeholder: 'Derecho / Izquierdo', type: 'text' },
    ],
  },
]

/** Datos demo del paciente Carlos Mendoza (sincronizado con /datos_reporte). */
export const DEMO_PERSON_DATA = CARLOS_PERSON_DATA
