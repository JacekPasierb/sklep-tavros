import Header from "../../components/layout/Header/Header";
import PromotionSection from "../../components/layout/PromotionSection";
import SocialSection from "../../components/common/SocialSection";
import PoliciesSection from "../../components/common/PoliciesSection";
import PaymentsSection from "../../components/common/PaymentsSection";
import Footer from "../../components/layout/Footer/Footer";

export default function ShopLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <main>
        <PromotionSection />
        {children}
        <section className="grid grid-cols md:grid-cols-2 py-10">
          <SocialSection />
          <PoliciesSection />
        </section>
        <PaymentsSection />
        <Footer />
      </main>
    </>
  );
}
