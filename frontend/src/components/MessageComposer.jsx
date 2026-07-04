import { useForm } from 'react-hook-form'
import { useState } from 'react'

function MessageComposer({ chat, onSend, disabled = false }) {
  const [isSending, setIsSending] = useState(false)
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { message: '' },
  })
  const message = watch('message')

  const submitMessage = async ({ message }) => {
    const text = message.trim()

    if (!text || disabled || isSending) return

    setIsSending(true)

    try {
      await onSend(text)
      reset()
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="composer">
      <form onSubmit={handleSubmit(submitMessage)}>
        <input
          placeholder={
            disabled
              ? 'Select a chat to send a message.'
              : isSending
                ? 'Sending...'
                : `Message ${chat.name}...`
          }
          autoComplete="off"
          disabled={disabled || isSending}
          {...register('message')}
        />
        <button
          className="send-button"
          type="submit"
          disabled={disabled || isSending || !message?.trim()}
        >
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
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default MessageComposer
