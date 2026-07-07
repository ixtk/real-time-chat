import Avatar from './Avatar'

function AccountPanel({ account, onLogout }) {
  return (
    <div className="account">
      <Avatar user={account} size="small" />
      <div>
        <strong>{account.name}</strong>
        <p>Active now</p>
      </div>
      <button className="signout" type="button" title="Sign out" onClick={onLogout}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  )
}

export default AccountPanel
