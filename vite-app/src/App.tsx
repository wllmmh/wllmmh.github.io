import { type ReactNode } from "react"
import { Dialog } from "@base-ui/react/dialog"
import {
  ArrowUpRightIcon,
  EnvelopeIcon,
  QrCodeIcon,
  XIcon,
} from "@phosphor-icons/react"

import githubLogo from "@/assets/github-logo.svg"
import linkedinLogo from "@/assets/linkedin-logo-white.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import content from "@/content.json"

// Every mark is 16px so it optically matches the 14px link text beside it;
// the previous 20px made the contact row read bottom-heavy. All icons are
// pinned white (not theme-flipping muted-foreground), so GitHub's mark
// needs a fixed dark chip behind it to stay visible on the light page.
const SOCIAL_ICON: Record<string, ReactNode> = {
  LinkedIn: <img src={linkedinLogo} alt="" className="size-4 shrink-0" />,
  GitHub: (
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-xs bg-[#161b22] p-px">
      <img src={githubLogo} alt="" className="size-full" />
    </span>
  ),
  Email: (
    <EnvelopeIcon className="size-4 shrink-0 text-white" aria-hidden="true" />
  ),
}

type Project = (typeof content.projects)[number]

/**
 * One card per project, all visible at once in a grid. Screenshots vary in
 * shape (16:9 app captures, a near-square wireframe), so each sits whole in a
 * fixed 16:10 frame rather than being cropped to fill it; the frame keeps
 * every card's text starting at the same height across a row.
 */
function ProjectCard({ item }: { item: Project }) {
  return (
    <Card className="h-full gap-4 pt-0 text-sm">
      <div className="relative aspect-[16/10] border-b bg-muted">
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 size-full object-contain"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              {item.title}
              <ArrowUpRightIcon
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </a>
          </h3>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
            {item.caption}
          </p>
        </div>

        <p className="leading-[1.7] text-pretty">{item.description}</p>

        {item.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => (
              <Button
                key={link.href}
                variant="secondary"
                size="sm"
                render={<a href={link.href} target="_blank" rel="noreferrer" />}
              >
                {link.label} →
              </Button>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-2">
        {item.tech.map((tech) => (
          <Badge
            key={tech}
            variant="secondary"
            className="text-[0.8125rem] font-normal"
          >
            {tech}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}

export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-12 px-6 py-16 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-7 sm:gap-8">
        {/* Identity block: the headshot belongs with the name it names, not
            inline in the link row, where it read as a fifth, label-less link.
            The name is ~16 monospace characters, which is wider than a phone
            can hold beside a portrait, so below `sm` the two stack and the
            name gets the full column. */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <Avatar className="size-16 shrink-0 border border-border sm:size-[4.5rem]">
            <AvatarImage
              src={content.contact.headshot}
              alt={content.contact.headshotAlt}
            />
            <AvatarFallback>WH</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
              {content.name}
            </h1>
            <p className="mt-1.5 text-sm tracking-[0.02em] text-muted-foreground sm:text-base">
              {content.title}
            </p>
          </div>
        </div>

        {/* The summary runs the page's full width. */}
        <p className="w-full text-[0.9375rem] leading-[1.7] text-pretty text-muted-foreground sm:leading-[1.75]">
          {content.summary}
        </p>

        {/* Icon-only row: labels made this read busy next to the QR glyph,
            and these marks (mail/LinkedIn/GitHub/QR) are conventional
            enough to stand alone. Targets are 44px tall on touch via the
            negative-margin trick, which keeps the visual rhythm of the row
            while meeting the tap minimum. */}
        <nav
          id="contact"
          aria-label="Contact"
          className="-mx-1 -my-2 flex flex-wrap items-center gap-x-0.5"
        >
          {content.contact.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={`${item.label}: ${item.value}`}
              className="flex min-h-11 min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {SOCIAL_ICON[item.label]}
            </a>
          ))}

          <Dialog.Root>
            <Dialog.Trigger
              render={
                <button
                  type="button"
                  aria-label="Show QR code for this page"
                  className="flex min-h-11 min-w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                />
              }
            >
              <QrCodeIcon
                className="size-4 shrink-0 text-white"
                aria-hidden="true"
              />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-[4000] bg-black/60 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
              <Dialog.Popup
                // Leaves the top ~11.5rem of the viewport clear so the
                // header (avatar, h1, title) stays visible behind the
                // dialog at every screen width, per the request.
                className="fixed inset-x-0 top-[11.5rem] bottom-0 z-[4000] flex flex-col items-center gap-4 bg-background p-6 pt-8 transition-all duration-150 outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
              >
                <Dialog.Close
                  render={
                    <button
                      type="button"
                      aria-label="Close"
                      className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    />
                  }
                >
                  <XIcon className="size-5" aria-hidden="true" />
                </Dialog.Close>
                <img
                  src="./qr-code.svg"
                  alt="QR code for wllmmh.github.io"
                  className="min-h-0 w-full max-w-[min(90vw,32rem)] flex-1 object-contain"
                />
                <Dialog.Title className="font-heading text-sm tracking-[0.02em] text-muted-foreground">
                  wllmmh.github.io
                </Dialog.Title>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </nav>
      </header>

      <Separator />

      <section aria-labelledby="portfolio-heading">
        <h2
          id="portfolio-heading"
          className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase"
        >
          Portfolio
        </h2>

        <ul className="mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
          {content.projects.map((item) => (
            <li key={item.id}>
              <ProjectCard item={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
