import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="page-card">
      <h1>Welcome to COE App</h1>
      <p>
        This is your landing page. Use industry best practices for auth and routing.
      </p>
      <div className="page-actions">
        <Link className="button" to="/login">
          Log in
        </Link>
        <Link className="button button-secondary" to="/signup">
          Sign up
        </Link>
      </div>
    </section>
  )
}
