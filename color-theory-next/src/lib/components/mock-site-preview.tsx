import chroma from 'chroma-js';
import { PaletteType } from '@/lib/types';

export default function MockSitePreview({ palette, useWhiteBase }: { palette: PaletteType; useWhiteBase: boolean }) {

  // White base => mostly #fff or near white sections, with brand accent in nav or CTA.
  const navBg = useWhiteBase ? palette.primary : palette.primary;
  const navTextColor = chroma.contrast(navBg, 'black') > 7.5 ? 'black' : 'white';

  const heroBg = useWhiteBase ? '#fff' : palette.monotonal.light;
  const heroTextColor = chroma.contrast(heroBg, 'black') > 4.5 ? 'black' : 'white';

  const featuresBg = useWhiteBase ? '#fafafa' : palette.analogous[0];
  const featuresTextColor = chroma.contrast(featuresBg, 'black') > 4.5 ? 'black' : 'white';

  const testimonialBg = useWhiteBase ? '#fefefe' : palette.triadic[0];
  const testimonialTextColor = chroma.contrast(testimonialBg, 'black') > 4.5 ? 'black' : 'white';

  const ctaBg = useWhiteBase ? palette.complementary : palette.variants.loud;
  const ctaTextColor = chroma.contrast(ctaBg, 'black') > 4.5 ? 'black' : 'white';

  const footerBg = useWhiteBase ? '#f8f9fa' : palette.monotonal.dark;
  const footerTextColor = chroma.contrast(footerBg, 'black') > 4.5 ? 'black' : 'white';

  // hero button
  const heroCtaBg = useWhiteBase ? palette.complementary : palette.monotonal.dark;
  const heroCtaColor = chroma.contrast(heroCtaBg, 'black') > 4.5 ? 'black' : 'white';

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Site Preview</h2>

      <div className="border border-gray-300 rounded shadow overflow-hidden flex flex-col">
        {/* NAVIGATION */}
        <nav
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: navBg, color: navTextColor }}
        >
          <h1 className="font-bold text-xl">My Brand</h1>
          <ul className="flex gap-6 text-sm font-medium">
            <li className="hover:opacity-80 cursor-pointer">Home</li>
            <li className="hover:opacity-80 cursor-pointer">Features</li>
            <li className="hover:opacity-80 cursor-pointer">About</li>
            <li className="hover:opacity-80 cursor-pointer">Contact</li>
          </ul>
        </nav>

        {/* HERO SECTION */}
        <section
          className="p-10 text-center"
          style={{ backgroundColor: heroBg, color: heroTextColor }}
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Empower Your Business</h2>
            <p className="mb-6">
              Welcome to our platform, where innovative solutions come together
              to boost your success.
            </p>
            <button
              className="px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: heroCtaBg, color: heroCtaColor }}
            >
              Get Started
            </button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section
          className="p-8"
          style={{ backgroundColor: featuresBg, color: featuresTextColor }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Our Core Features</h2>
            <p className="mb-6">Experience unrivaled quality, performance, and design.</p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Speed</h3>
                <p className="text-sm">
                  Blazing fast performance to handle your daily tasks with ease.
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Security</h3>
                <p className="text-sm">
                  Bank-grade encryption and advanced protection for all your data.
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Design</h3>
                <p className="text-sm">
                  Clean, intuitive interfaces that elevate user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section
          className="p-8 text-center"
          style={{ backgroundColor: testimonialBg, color: testimonialTextColor }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">What Our Clients Say</h2>
            <blockquote className="italic text-lg mb-3">
              "A game-changer! Our productivity soared, and our customers love
              the seamless experience."
            </blockquote>
            <cite className="block text-sm text-gray-700/80">
              - A Satisfied Customer
            </cite>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section
          className="p-10 text-center"
          style={{ backgroundColor: ctaBg, color: ctaTextColor }}
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="mb-6">Sign up today and see why thousands trust our platform.</p>
            <button
              className="px-6 py-3 rounded font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: footerBg, color: footerTextColor }}
            >
              Start Free Trial
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="text-center py-4 mt-auto"
          style={{ backgroundColor: footerBg, color: footerTextColor }}
        >
          <p className="text-sm">&copy; 2025 MyBrand Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};