import React from 'react'

function Testcontents() {
  return (
    <div>
      <div class="flex flex-col min-h-dvh">
  <header class="bg-background border-b px-4 lg:px-6 h-14 flex items-center">
    <a class="flex items-center justify-center" href="#">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-6 text-primary"
      >
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
        <path d="M10 2c1 .5 2 2 2 5"></path>
      </svg>
      <span class="sr-only">Apple</span>
    </a>
    <nav class="ml-auto flex gap-4 sm:gap-6">
      <a class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground" href="#">
        iPhone 14
      </a>
      <a class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground" href="#">
        iPhone 13
      </a>
      <a class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground" href="#">
        iPhone 12
      </a>
      <a class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground" href="#">
        iPhone 11
      </a>
    </nav>
  </header>
  <main class="flex-1">
    <section class="w-full pt-12 md:pt-24 lg:pt-32">
      <div class="container space-y-10 xl:space-y-16">
        <div class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
          <div>
            <img
              src="/placeholder.svg"
              width="800"
              height="600"
              alt="iPhone 14 Pro"
              class="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
            />
          </div>
          <div class="flex flex-col items-start space-y-4">
            <h1 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              iPhone 14 Pro
            </h1>
            <p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The most advanced Pro camera system ever. A lightning-fast chip. And always-on display. iPhone 14 Pro
              is a huge leap forward.
            </p>
            <button
              class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              href="#"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full py-12 md:py-24 lg:py-32">
      <div class="container space-y-12 px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">All iPhone Models</h2>
            <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our selection of the latest iPhone models and find the one that's right for you.
            </p>
          </div>
        </div>
        <div class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <div class="grid gap-4 bg-background rounded-lg p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width="400"
              height="300"
              alt="iPhone 14 Pro"
              class="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            />
            <div class="grid gap-1">
              <h3 class="text-lg font-bold">iPhone 14 Pro</h3>
              <p class="text-sm text-muted-foreground">$999</p>
              <button
                class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Buy
              </button>
            </div>
          </div>
          <div class="grid gap-4 bg-background rounded-lg p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width="400"
              height="300"
              alt="iPhone 14"
              class="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            />
            <div class="grid gap-1">
              <h3 class="text-lg font-bold">iPhone 14</h3>
              <p class="text-sm text-muted-foreground">$799</p>
              <button
                class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Buy
              </button>
            </div>
          </div>
          <div class="grid gap-4 bg-background rounded-lg p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width="400"
              height="300"
              alt="iPhone 13"
              class="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            />
            <div class="grid gap-1">
              <h3 class="text-lg font-bold">iPhone 13</h3>
              <p class="text-sm text-muted-foreground">$699</p>
              <button
                class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Buy
              </button>
            </div>
          </div>
          <div class="grid gap-4 bg-background rounded-lg p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width="400"
              height="300"
              alt="iPhone 12"
              class="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            />
            <div class="grid gap-1">
              <h3 class="text-lg font-bold">iPhone 12</h3>
              <p class="text-sm text-muted-foreground">$599</p>
              <button
                class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Buy
              </button>
            </div>
          </div>
          <div class="grid gap-4 bg-background rounded-lg p-6 shadow-sm">
            <img
              src="/placeholder.svg"
              width="400"
              height="300"
              alt="iPhone 11"
              class="mx-auto aspect-video overflow-hidden rounded-lg object-cover object-center"
            />
            <div class="grid gap-1">
              <h3 class="text-lg font-bold">iPhone 11</h3>
              <p class="text-sm text-muted-foreground">$499</p>
              <button
                class="whitespace-nowrap ring-offset-background focus-visible:ring-offset-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
    <p class="text-xs text-muted-foreground">© 2024 Apple Inc. All rights reserved.</p>
    <nav class="sm:ml-auto flex gap-4 sm:gap-6">
      <a class="text-xs hover:underline underline-offset-4 text-primary-foreground" href="#">
        Terms of Service
      </a>
      <a class="text-xs hover:underline underline-offset-4 text-primary-foreground" href="#">
        Privacy
      </a>
    </nav>
  </footer>
</div>
    </div>
  )
}

export default Testcontents
