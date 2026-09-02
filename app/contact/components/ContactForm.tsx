'use client';

import { useRef, useState } from 'react';

import { contactForm } from '../content';
import { openWhatsAppMessage } from '../../Services/openWhatsApp';

/**
 * The contact form, asked one question at a time.
 *
 * Answers stack upward as chat bubbles above the live input, so the panel
 * reads as a conversation rather than a wall of fields — three short prompts
 * ask less of a visitor on a phone than one long form does, and the answered
 * bubbles keep what they have already said in view.
 *
 * There is no backend: submitting composes the answers into a message and
 * hands them to WhatsApp, which is where the resort already takes enquiries
 * (the header icon and every room CTA open the same thread). That is why the
 * final action must stay inside a click handler — `window.open` only reaches
 * a new tab from a user gesture.
 *
 * On the `!` suffixes: `styles/globals.css` imports `tailwindcss/preflight` a
 * second time, unlayered, after `tailwindcss` has already put it in the `base`
 * layer. Unlayered rules outrank every layered one whatever the specificity,
 * so preflight's `*{margin:0;padding:0;border:0 solid}` and its form-element
 * reset (`background-color:transparent;border-radius:0;color:inherit`) beat
 * the utilities that would otherwise style these fields. Marking those
 * declarations important is how the rest of the codebase gets padding and
 * borders to land — see `Header`'s `border-b!` and every `px-…!` button.
 */

type Step = {
  id: 'name' | 'phone' | 'message';
  /** Placeholder, and the visually-hidden label the field is announced by. */
  prompt: string;
  type: 'text' | 'tel' | 'textarea';
  autoComplete: string;
  /** Returns an error string, or null when the answer will do. */
  validate: (value: string) => string | null;
};

const STEPS: Step[] = [
  {
    id: 'name',
    prompt: 'Your name',
    type: 'text',
    autoComplete: 'name',
    validate: value => (value.length < 2 ? 'Please enter your name.' : null),
  },
  {
    id: 'phone',
    prompt: 'Phone or email',
    type: 'tel',
    autoComplete: 'tel',
    /* Deliberately loose. This is a way to reach someone back, not a record to
       be parsed, and it takes an email as happily as a number — so the only
       thing worth rejecting is an entry too short to be either. */
    validate: value =>
      value.length < 6
        ? 'Please leave a number or email we can reply to.'
        : null,
  },
  {
    id: 'message',
    prompt: 'Your message',
    type: 'textarea',
    autoComplete: 'off',
    validate: value =>
      value.length < 4 ? 'Please tell us a little about your stay.' : null,
  },
];

type Answers = Partial<Record<Step['id'], string>>;

/**
 * Whether `ScrollSmoother` currently owns scrolling.
 *
 * The same test `app/lib/scroll.ts` uses, and for the same reason: only the
 * smoother sets `position: fixed` on the wrapper, so this reads the live state
 * rather than guessing from a breakpoint, and needs no GSAP import to answer.
 */
function smootherIsRunning() {
  const wrapper = document.getElementById('smooth-wrapper');
  return !!wrapper && getComputedStyle(wrapper).position === 'fixed';
}

/** The WhatsApp body, composed from the answers. */
function composeMessage(answers: Answers) {
  return `Hi Chembarathi, I’d like to get in touch.

Name: ${answers.name}
Contact: ${answers.phone}

${answers.message}`;
}

const FIELD_BASE =
  'w-full border! border-(--border-color-default)! bg-(--surface-primary-700)! ' +
  'px-(--spacing-padding-6x)! py-(--spacing-padding-4x)! ' +
  'text-lg-regular text-(--typography-color-secondary-100)! outline-none! ' +
  'transition-colors placeholder:text-(--typography-color-primary-100)! ' +
  'focus:border-(--typography-color-primary-300)!';

export default function ContactForm() {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  /** Set once the message has been handed off; holds the link to repeat it. */
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const step = STEPS[stepIndex];
  const answered = STEPS.slice(0, stepIndex);
  const isLastStep = stepIndex === STEPS.length - 1;

  /**
   * Moves to `index`, loading whatever was answered there back into the field.
   * Focus only ever follows an interaction, never a mount, so the page can
   * never open with the viewport yanked down to this panel.
   */
  const goToStep = (index: number, from: Answers) => {
    setStepIndex(index);
    setDraft(from[STEPS[index].id] ?? '');
    setError(null);
    /* Focusing a field scrolls it into view natively, which is exactly what a
       phone wants when the keyboard opens — and exactly what must not happen
       above 1024px, where `ScrollSmoother` owns the scroll position and a
       native jump fights it. `preventScroll` is conditional for that reason,
       not blanket. */
    requestAnimationFrame(() =>
      fieldRef.current?.focus({ preventScroll: smootherIsRunning() })
    );
  };

  const handleSubmit = (event: React.FormEvent | React.KeyboardEvent) => {
    event.preventDefault();

    const value = draft.trim();
    const message = step.validate(value);

    if (message) {
      setError(message);
      return;
    }

    const next = { ...answers, [step.id]: value };
    setAnswers(next);

    if (!isLastStep) {
      goToStep(stepIndex + 1, next);
      return;
    }

    setSentUrl(openWhatsAppMessage(composeMessage(next)));
  };

  const reset = () => {
    setAnswers({});
    setStepIndex(0);
    setDraft('');
    setError(null);
    setSentUrl(null);
  };

  if (sentUrl) {
    return (
      <div className="flex w-full flex-col gap-(--spacing-padding-3x)">
        <div className="flex flex-col gap-(--spacing-padding-3x) rounded-3xl bg-(--surface-secondary-600) px-(--spacing-padding-6x)! py-(--spacing-padding-6x)!">
          <h2 className="text-heading-6 text-(--typography-color-secondary-1000)">
            Thanks, {answers.name}.
          </h2>
          <p className="text-md-regular leading-normal! text-(--typography-color-secondary-1000)/70">
            Your message is waiting in WhatsApp — send it there and we will
            reply in the same chat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-(--spacing-padding-3x)">
          {/* `window.open` returns null under `noopener` whether or not the tab
              opened, so a blocked popup cannot be detected. This link is
              always offered rather than guessed at. */}
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-(--surface-secondary-100) px-(--spacing-padding-8x)! py-(--spacing-padding-3x)! text-lg-regular text-(--typography-color-secondary-1000)"
          >
            Open WhatsApp
          </a>

          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-full! border! border-(--border-color-muted)! px-(--spacing-padding-8x)! py-(--spacing-padding-3x)! text-lg-regular text-(--typography-color-secondary-700)! transition-colors hover:border-(--border-color-default)!"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-(--spacing-padding-3x)">
      {/* Header bubble. It carries the note only on the first step, where
          nothing sits above it — once answers start stacking they say plenty,
          and the note would push the live field off a short screen. */}
      <div className="flex flex-col gap-(--spacing-padding-8x) rounded-3xl bg-(--surface-secondary-600) px-(--spacing-padding-6x)! py-(--spacing-padding-6x)!">
        <h2 className="text-heading-6 text-(--typography-color-secondary-1000)">
          {contactForm.title}
        </h2>

        {/* The step count is no longer shown, but a visitor on a screen reader
            still needs to know where they are in a form that reveals itself
            one question at a time — so it survives as an announcement only. */}
        <span aria-live="polite" className="sr-only">
          Step {stepIndex + 1} of {STEPS.length}
        </span>

        {stepIndex === 0 && (
          <p className="text-md-regular leading-normal! text-(--typography-color-secondary-1000)/70">
            {contactForm.note}
          </p>
        )}
      </div>

      {/* Answered steps, oldest first, each one a way back to that question. */}
      {answered.map((previous, index) => (
        <button
          key={previous.id}
          type="button"
          onClick={() => goToStep(index, answers)}
          className="group flex w-full cursor-pointer flex-col items-start gap-(--spacing-padding-x) rounded-3xl! border! border-(--border-color-muted)! bg-(--surface-primary-700)! px-(--spacing-padding-6x)! py-(--spacing-padding-3x)! text-left transition-colors hover:border-(--border-color-default)!"
        >
          <span className="text-body-xs uppercase text-(--typography-color-primary-100)">
            {previous.prompt}
            <span className="ml-(--spacing-padding-2x)! opacity-0 transition-opacity group-hover:opacity-100">
              — edit
            </span>
          </span>
          <span className="text-lg-regular whitespace-pre-line text-(--typography-color-secondary-700)">
            {answers[previous.id]}
          </span>
        </button>
      ))}

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-end gap-(--spacing-padding-3x)">
          <label className="flex-1">
            <span className="sr-only">{step.prompt}</span>

            {step.type === 'textarea' ? (
              <textarea
                ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                /* Enter inserts a newline in a message, so this field submits
                   on the button or the shortcut, never on a stray Return. */
                onKeyDown={event => {
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey))
                    handleSubmit(event);
                }}
                rows={2}
                placeholder={step.prompt}
                autoComplete={step.autoComplete}
                aria-invalid={Boolean(error)}
                className={`${FIELD_BASE} resize-none! rounded-3xl! block`}
              />
            ) : (
              <input
                ref={fieldRef as React.RefObject<HTMLInputElement>}
                type={step.type}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                placeholder={step.prompt}
                autoComplete={step.autoComplete}
                aria-invalid={Boolean(error)}
                className={`${FIELD_BASE} rounded-full!`}
              />
            )}
          </label>

          <button
            type="submit"
            aria-label={isLastStep ? 'Send on WhatsApp' : 'Next'}
            /* Never disabled: an empty submit is how a visitor finds out what
               the field wants, and a dead button explains nothing. */
            className="flex h-[56px] w-[56px] shrink-0 cursor-pointer items-center justify-center rounded-full! border! border-(--border-color-default)! bg-(--surface-primary-700)! text-(--typography-color-secondary-100)! transition-colors hover:bg-(--surface-secondary-100)! hover:text-(--typography-color-secondary-1000)!"
          >
            <span className="material-symbols-outlined text-base!">
              {isLastStep ? 'send' : 'arrow_forward'}
            </span>
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-(--spacing-padding-3x)! px-(--spacing-padding-6x)! text-md-regular text-(--typography-color-status-alert)"
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
