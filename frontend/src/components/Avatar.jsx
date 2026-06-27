function Avatar({ user, size = '' }) {
  return (
    <div
      className={`avatar ${size}`}
      style={{ backgroundColor: user.color }}
      aria-hidden="true"
    >
      {user.initials}
    </div>
  )
}

export default Avatar
