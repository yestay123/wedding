import './Navbar.css'

interface NavbarProps {
  leftName?: string
  rightName?: string
  dark?: boolean
}

export function Navbar({
  leftName = 'Temirlan',
  rightName = 'Aruna',
  dark = false,
}: NavbarProps) {
  return (
    <header className={`navbar${dark ? ' navbar--dark' : ''}`}>
      <span className="navbar__name navbar__name--left">{leftName}</span>
      <span className="navbar__rings">
        <img src="/rings.svg" alt="wedding rings" draggable={false} />
      </span>
      <span className="navbar__name navbar__name--right">{rightName}</span>
    </header>
  )
}
