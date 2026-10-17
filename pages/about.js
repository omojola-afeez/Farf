import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { categoryList } from '@/lib/categories';

// Add real photos here once you have them. This page intentionally uses no stock images.
export default function About() {
  return (
    <>
      <PageHead title="About FARF" description="FARF sells everyday household, school and DIY essentials." />
      <div className="mx-auto my-10 w-[calc(100%-2rem)] glass-strong rounded-[2rem] p-6 sm:p-10 max-w-3xl">
        <h1 className="text-3xl">About FARF</h1>
        <div className="mt-6 space-y-4 text-lg text-slate-800">
          <p>
            FARF is a store for the things a household actually needs: kitchen tools, school supplies, DIY
            tools, gadgets and home utilities. The range is practical and priced for everyday use.
          </p>
          <p>
            The store is organised two ways. You can shop by collection, or by occasion: school items, a new
            apartment, or a weekend fix-it project.
          </p>
        </div>

        <h2 className="mt-8 text-2xl">What we sell</h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categoryList.map((c) => (
            <li key={c.slug} className={`rounded-xl border-2 p-4 ${c.accent.soft} ${c.accent.border}`}>
              <h3 className={`text-lg ${c.accent.text}`}>{c.title}</h3>
              <p className="mt-1 text-base text-slate-700">{c.blurb}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn-primary">Shop all products</Link>
          <Link href="/contact" className="btn-secondary">Contact us</Link>
        </div>
      </div>
    </>
  );
}
