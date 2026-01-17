import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#D9CFC7] to-[#C5B9AE] text-[#4a4a4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo-vitacare.svg" alt="VitaCare" className="h-12 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed">
              VitaCare - Votre parapharmacie en ligne de confiance pour le bien-être et les soins de qualité. 
              Nous sélectionnons les meilleurs produits pour votre santé.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/charifa.benfraj" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#96A78D] rounded-full flex items-center justify-center text-white hover:bg-[#7a8b73] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/></svg>
              </a>
              <a href="https://www.instagram.com/charifa_benfraj" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#96A78D] rounded-full flex items-center justify-center text-white hover:bg-[#7a8b73] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/></svg>
              </a>
              <a href="mailto:charifabenfraj20@gmail.com" className="w-10 h-10 bg-[#96A78D] rounded-full flex items-center justify-center text-white hover:bg-[#7a8b73] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#2E7D32]">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Catégories</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Produits</span>
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Promotions</span>
                </Link>
              </li>
              <li>
                <Link href="/packs" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Packs</span>
                </Link>
              </li>
              <li>
                <Link href="/cart" className="flex items-center space-x-2 hover:text-[#96A78D] transition-colors group">
                  <span className="w-1.5 h-1.5 bg-[#96A78D] rounded-full group-hover:scale-150 transition-transform"></span>
                  <span>Mon Panier</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#2E7D32]">Contactez-nous</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#96A78D]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Charifa Ben Fraj</p>
                  <p className="text-sm text-[#6a6a6a]">Fondatrice & Gérante</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#96A78D]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:charifabenfraj20@gmail.com" className="text-sm text-[#6a6a6a] hover:text-[#96A78D] transition-colors">
                    charifabenfraj20@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#96A78D]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <a href="tel:+21627998555" className="text-sm text-[#6a6a6a] hover:text-[#96A78D] transition-colors">
                    +216 27 998 555
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#96A78D]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p className="text-sm text-[#6a6a6a]">Hammamet, Nabeul, Tunisie</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#B6AE9F] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-[#2E7D32]">VitaCare</span>. Tous droits réservés.
            </p>
            <p className="text-sm text-[#6a6a6a]">
              Développé avec 💚 par <span className="font-semibold">Charifa Ben Fraj</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
