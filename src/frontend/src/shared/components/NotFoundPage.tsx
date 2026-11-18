import { Button } from '@mui/material'
import { Link } from 'react-router'

function SleepingCatIllustration() {
  return (
    <svg
      aria-labelledby="sleeping-cat-title"
      className="not-found-illustration"
      role="img"
      viewBox="0 0 520 360"
    >
      <title id="sleeping-cat-title">A sleeping orange cat resting on a stack of books</title>
      <ellipse className="not-found-illustration__shadow" cx="258" cy="322" rx="205" ry="20" />

      <g className="not-found-illustration__plant">
        <path d="M102 282c-6-63 8-108 42-148" />
        <path d="M120 218c-31-2-49-18-54-42 29-2 47 12 54 42Z" />
        <path d="M128 187c1-31 15-51 39-59 5 27-7 48-39 59Z" />
        <path d="M108 252c-28 2-45-9-54-31 25-6 44 4 54 31Z" />
        <path d="M139 159c-2-25 9-42 30-51 7 22-3 40-30 51Z" />
      </g>

      <g className="not-found-illustration__books">
        <rect x="108" y="258" width="318" height="62" rx="5" />
        <path d="M138 270h250c18 0 25 7 25 19s-7 19-25 19H138" />
        <rect x="145" y="204" width="285" height="58" rx="5" />
        <path d="M171 216h220c18 0 25 7 25 17s-7 17-25 17H171" />
        <rect x="126" y="169" width="274" height="40" rx="5" />
      </g>

      <g className="not-found-illustration__cat">
        <path className="cat-tail" d="M215 145c-48 31-79 14-72-14 5-20 26-25 40-13" />
        <ellipse className="cat-body" cx="252" cy="126" rx="92" ry="52" />
        <ellipse className="cat-patch" cx="230" cy="113" rx="46" ry="28" />
        <path className="cat-head" d="M285 103 301 79l15 19 29-3 12 27v32c0 24-17 41-41 41h-8c-27 0-46-18-46-44v-29Z" />
        <path className="cat-ear" d="m287 103 14-24 11 22Z" />
        <path className="cat-ear" d="m327 99 18-4 10 24Z" />
        <path className="cat-face" d="M281 142c7 6 14 6 20 0M325 142c7 6 14 6 20 0M308 153l6 4 6-4M314 157c-2 8-9 10-16 6M314 157c2 8 9 10 16 6" />
        <path className="cat-whiskers" d="M294 155h-37M294 162l-34 8M334 155h36M334 162l34 8" />
        <ellipse className="cat-paw" cx="292" cy="184" rx="29" ry="10" />
        <ellipse className="cat-paw" cx="340" cy="184" rx="29" ry="10" />
      </g>

      <g className="not-found-illustration__sleep">
        <text x="171" y="82">Z</text>
        <text x="196" y="54">Z</text>
        <text x="224" y="29">Z</text>
      </g>
    </svg>
  )
}

export function NotFoundPage() {
  return (
    <section className="not-found-page page-container">
      <SleepingCatIllustration />
      <div className="not-found-page__content">
        <h1>
          <span>404</span>
          Page Not Found
        </h1>
        <p>The page you’re looking for doesn’t exist or has been moved.</p>
        <Button component={Link} to="/" variant="contained" color="secondary">
          Go to Home
        </Button>
      </div>
    </section>
  )
}
