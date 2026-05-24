import '@/presentation/styles/landing-tokens.css'
import styles from './HomePage.module.css'
import { HomeNav } from './sections/HomeNav'
import { HomeHero } from './sections/HomeHero'
import { HomeProstheticAssistant } from './sections/HomeProstheticAssistant'
import { HomeProcess } from './sections/HomeProcess'
import { HomeTestimonial } from './sections/HomeTestimonial'
import { HomeCta } from './sections/HomeCta'
import { HomeFooter } from './sections/HomeFooter'

export function HomePage() {
  return (
    <main className={`landingRoot ${styles.page}`}>
      <HomeNav />
      <HomeHero />

      <HomeProstheticAssistant />


      <HomeCta />
      <HomeFooter />
    </main>
  )
}
