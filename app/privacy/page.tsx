import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-(--color-background-primary)">
      <header className="flex h-14 items-center border-b border-(--color-border-tertiary) px-6">
        <a href="/">
          <Image src="/logo.png" alt="Kisku.online" width={120} height={40} className="rounded-[8px]" />
        </a>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-[22px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Privacy Policy</h1>
        <p className="mb-8 text-[13px] text-(--color-text-tertiary)">Last updated 15 May 2026</p>

        <div className="flex flex-col gap-7 text-[13px] leading-relaxed text-(--color-text-secondary)">
          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">What we store</h2>
            <p>When you save an album, your photos are stored in Cloudflare R2 (US region). Your album settings — print size, orientation, and per-photo editor values — are stored in a Neon Postgres database. We store your email address so we can send you a sign-in link and associate your albums with your account.</p>
          </section>

          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">Photos you don&apos;t save</h2>
            <p>If you use Kisku without saving an album, your photos never leave your device. All editing happens in your browser only.</p>
          </section>

          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">Third-party sharing</h2>
            <p>We do not sell, share, or transfer your photos or personal data to any third party. We use Cloudflare R2 (storage) and Neon (database) as infrastructure providers — they process data on our behalf under data processing agreements.</p>
          </section>

          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">Deleting your data</h2>
            <p>You can delete any album from your dashboard at any time. Deleting an album permanently removes all associated photos from Cloudflare R2 and all metadata from our database. To delete your entire account and all data, email us at <a href="mailto:privacy@kisku.online" className="text-navy-800 underline">privacy@kisku.online</a>.</p>
          </section>

          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">Retention</h2>
            <p>We retain your data for as long as your account is active. If you request account deletion, all your data is removed within 30 days.</p>
          </section>

          <section>
            <h2 className="mb-2 text-[14px] font-medium text-(--color-text-primary)">Contact</h2>
            <p>Questions about this policy? Email <a href="mailto:privacy@kisku.online" className="text-navy-800 underline">privacy@kisku.online</a>.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
