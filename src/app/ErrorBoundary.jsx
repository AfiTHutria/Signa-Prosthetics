import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export class ErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Error inesperado' }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' })
    window.location.assign('/')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <h1>Algo salió mal</h1>
          <p>{this.state.message}</p>
          <button type="button" onClick={this.handleRetry}>
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
