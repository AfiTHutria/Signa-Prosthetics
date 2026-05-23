import { PERSON_DATA_SECTIONS } from '@/shared/constants/personDataFields'
import styles from './PersonDataForm.module.css'

export function PersonDataForm({ values = {}, readOnly = true }) {
  return (
    <div className={styles.form}>
      {PERSON_DATA_SECTIONS.map((section) => (
        <section key={section.id} className={styles.section}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <div className={styles.fieldGrid}>
            {section.fields.map((field) => (
              <label key={field.id} className={styles.field}>
                <span className={styles.label}>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    className={styles.input}
                    placeholder={field.placeholder}
                    defaultValue={values[field.id] ?? ''}
                    readOnly={readOnly}
                    rows={2}
                  />
                ) : (
                  <input
                    className={styles.input}
                    type={field.type}
                    placeholder={field.placeholder}
                    defaultValue={values[field.id] ?? ''}
                    readOnly={readOnly}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
