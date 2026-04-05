"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'

export function TaxGuide() {
  const [open, setOpen] = useState(false)
  const { lang } = useApp()

  return (
    <Card>
      <CardContent>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="tax-guide-panel"
          className="w-full flex items-center justify-between focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-lg"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">
              {lang === 'ne' ? 'कर कसरी गणना हुन्छ र कसरी घटाउने?' : 'How is tax calculated & how to reduce it?'}
            </span>
          </div>
          {open ? <ChevronUp size={16} className="text-muted-foreground" aria-hidden="true" /> : <ChevronDown size={16} className="text-muted-foreground" aria-hidden="true" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id="tax-guide-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-5 text-sm text-muted-foreground">
                {lang === 'ne' ? <NepaliContent /> : <EnglishContent />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function EnglishContent() {
  return (
    <>
      {/* How tax is calculated */}
      <div>
        <h4 className="text-foreground font-semibold mb-2">How your tax is calculated</h4>
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong className="text-foreground">Start with gross salary</strong> — your total monthly CTC before any deductions.</li>
          <li><strong className="text-foreground">Subtract SSF</strong> — 31% of basic salary (basic = 60% of gross). This goes to your Social Security Fund.</li>
          <li><strong className="text-foreground">Subtract CIT</strong> — voluntary contribution to Citizen Investment Trust, up to the retirement cap.</li>
          <li><strong className="text-foreground">Subtract other deductions</strong> — life insurance, health insurance, building insurance, donations.</li>
          <li><strong className="text-foreground">Apply progressive slabs</strong> — the remaining taxable income is taxed at increasing rates from 1% to 36%.</li>
          <li><strong className="text-foreground">Apply rebates</strong> — female employees get 10% off the tax (single filing only).</li>
        </ol>
      </div>

      {/* Tax slabs */}
      <div>
        <h4 className="text-foreground font-semibold mb-2">Tax slabs (FY 2081/82 — Single)</h4>
        <div className="bg-secondary/50 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="text-left py-2 px-3 font-semibold text-foreground">Income band</th>
                <th scope="col" className="text-right py-2 px-3 font-semibold text-foreground">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr><td className="py-1.5 px-3">First ₨ 5,00,000</td><td className="py-1.5 px-3 text-right font-mono">1% (SST)</td></tr>
              <tr><td className="py-1.5 px-3">Next ₨ 2,00,000</td><td className="py-1.5 px-3 text-right font-mono">10%</td></tr>
              <tr><td className="py-1.5 px-3">Next ₨ 3,00,000</td><td className="py-1.5 px-3 text-right font-mono">20%</td></tr>
              <tr><td className="py-1.5 px-3">Next ₨ 10,00,000</td><td className="py-1.5 px-3 text-right font-mono">30%</td></tr>
              <tr><td className="py-1.5 px-3">Next ₨ 30,00,000</td><td className="py-1.5 px-3 text-right font-mono">36%</td></tr>
              <tr><td className="py-1.5 px-3">Above ₨ 50,00,000</td><td className="py-1.5 px-3 text-right font-mono">39%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-1.5">If you contribute to SSF, the 1% SST slab is waived — effectively tax-free.</p>
      </div>

      {/* How to reduce */}
      <div>
        <h4 className="text-foreground font-semibold mb-2">Ways to legally reduce your tax</h4>
        <div className="space-y-2.5">
          <TipCard
            title="Contribute to SSF"
            desc="Waives the 1% SST on first ₨ 5 lakh and reduces taxable income by 31% of basic. This is the biggest single lever."
            saving="High impact"
            color="text-emerald-600 dark:text-emerald-400"
          />
          <TipCard
            title="Max out CIT"
            desc="Voluntary retirement contribution. Tax-deductible and government-subsidised at your marginal rate — 20-36% effective discount."
            saving="High impact"
            color="text-emerald-600 dark:text-emerald-400"
          />
          <TipCard
            title="Life insurance premium"
            desc="Up to ₨ 40,000/year is deductible. At 20% marginal rate, saves ₨ 8,000 in tax."
            saving="₨ 4,000–14,400/yr"
            color="text-blue-600 dark:text-blue-400"
          />
          <TipCard
            title="Health insurance premium"
            desc="Up to ₨ 20,000/year is deductible."
            saving="₨ 2,000–7,200/yr"
            color="text-blue-600 dark:text-blue-400"
          />
          <TipCard
            title="Couple filing"
            desc="If your spouse has no income, opt for couple assessment at IRD — first slab increases from ₨ 5L to ₨ 6L. But you lose the female 10% rebate."
            saving="Varies"
            color="text-amber-600 dark:text-amber-400"
          />
          <TipCard
            title="Donation to approved charities"
            desc="Up to ₨ 1,00,000 or 5% of taxable income (whichever is lower) is deductible."
            saving="₨ 1,000–36,000/yr"
            color="text-blue-600 dark:text-blue-400"
          />
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <p className="text-xs text-foreground">
          <strong>Key insight:</strong> SSF + CIT together reduce your taxable income the most. For someone earning ₨ 1,50,000/month,
          these two alone reduce annual taxable income by ₨ 5,00,000 — saving over ₨ 1,00,000 in tax.
        </p>
      </div>
    </>
  )
}

function NepaliContent() {
  return (
    <>
      <div>
        <h4 className="text-foreground font-semibold mb-2">तपाईंको कर कसरी गणना हुन्छ</h4>
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong className="text-foreground">कुल तलबबाट सुरु</strong> — कुनै पनि कटौती अघिको तपाईंको मासिक CTC।</li>
          <li><strong className="text-foreground">SSF घटाउनुहोस्</strong> — आधारभूत तलबको ३१% (आधारभूत = कुलको ६०%)। सामाजिक सुरक्षा कोषमा जान्छ।</li>
          <li><strong className="text-foreground">CIT घटाउनुहोस्</strong> — नागरिक लगानी कोषमा स्वैच्छिक योगदान।</li>
          <li><strong className="text-foreground">अन्य कटौती घटाउनुहोस्</strong> — जीवन बीमा, स्वास्थ्य बीमा, भवन बीमा, दान।</li>
          <li><strong className="text-foreground">प्रगतिशील स्ल्याब लागू</strong> — बाँकी करयोग्य आयमा १% देखि ३६% सम्म बढ्दो दरमा कर लाग्छ।</li>
          <li><strong className="text-foreground">छुट लागू</strong> — महिला कर्मचारीले करमा १०% छुट पाउँछन् (एकल दाखिला मात्र)।</li>
        </ol>
      </div>

      <div>
        <h4 className="text-foreground font-semibold mb-2">कर स्ल्याब (आ.व. २०८१/८२ — एकल)</h4>
        <div className="bg-secondary/50 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="text-left py-2 px-3 font-semibold text-foreground">आय ब्यान्ड</th>
                <th scope="col" className="text-right py-2 px-3 font-semibold text-foreground">दर</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr><td className="py-1.5 px-3">पहिलो ₨ ५,००,०००</td><td className="py-1.5 px-3 text-right font-mono">१% (SST)</td></tr>
              <tr><td className="py-1.5 px-3">अर्को ₨ २,००,०००</td><td className="py-1.5 px-3 text-right font-mono">१०%</td></tr>
              <tr><td className="py-1.5 px-3">अर्को ₨ ३,००,०००</td><td className="py-1.5 px-3 text-right font-mono">२०%</td></tr>
              <tr><td className="py-1.5 px-3">अर्को ₨ १०,००,०००</td><td className="py-1.5 px-3 text-right font-mono">३०%</td></tr>
              <tr><td className="py-1.5 px-3">अर्को ₨ ३०,००,०००</td><td className="py-1.5 px-3 text-right font-mono">३६%</td></tr>
              <tr><td className="py-1.5 px-3">₨ ५०,००,००० भन्दा माथि</td><td className="py-1.5 px-3 text-right font-mono">३९%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-1.5">SSF मा योगदान गरेमा, १% SST स्ल्याब माफ हुन्छ — प्रभावकारी रूपमा कर-मुक्त।</p>
      </div>

      <div>
        <h4 className="text-foreground font-semibold mb-2">कानूनी रूपमा कर कसरी घटाउने</h4>
        <div className="space-y-2.5">
          <TipCard
            title="SSF मा योगदान गर्नुहोस्"
            desc="पहिलो ₨ ५ लाखमा १% SST माफ र आधारभूतको ३१% ले करयोग्य आय घटाउँछ। सबैभन्दा ठूलो बचत।"
            saving="उच्च प्रभाव"
            color="text-emerald-600 dark:text-emerald-400"
          />
          <TipCard
            title="CIT अधिकतम बनाउनुहोस्"
            desc="स्वैच्छिक सेवानिवृत्ति योगदान। तपाईंको सीमान्त दरमा कर कटौतीयोग्य — २०-३६% प्रभावकारी छुट।"
            saving="उच्च प्रभाव"
            color="text-emerald-600 dark:text-emerald-400"
          />
          <TipCard
            title="जीवन बीमा प्रिमियम"
            desc="₨ ४०,०००/वर्ष सम्म कटौतीयोग्य।"
            saving="₨ ४,०००–१४,४००/वर्ष"
            color="text-blue-600 dark:text-blue-400"
          />
          <TipCard
            title="स्वास्थ्य बीमा प्रिमियम"
            desc="₨ २०,०००/वर्ष सम्म कटौतीयोग्य।"
            saving="₨ २,०००–७,२००/वर्ष"
            color="text-blue-600 dark:text-blue-400"
          />
          <TipCard
            title="दम्पती दाखिला"
            desc="पति/पत्नीको आय नभएमा, IRD मा दम्पती मूल्याङ्कन — पहिलो स्ल्याब ₨ ५L बाट ₨ ६L। तर महिला १०% छुट गुम्छ।"
            saving="फरक पर्छ"
            color="text-amber-600 dark:text-amber-400"
          />
          <TipCard
            title="स्वीकृत संस्थामा दान"
            desc="₨ १,००,००० वा करयोग्य आयको ५% (जुन कम) सम्म कटौतीयोग्य।"
            saving="₨ १,०००–३६,०००/वर्ष"
            color="text-blue-600 dark:text-blue-400"
          />
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <p className="text-xs text-foreground">
          <strong>मुख्य कुरा:</strong> SSF + CIT ले सँगै सबैभन्दा बढी करयोग्य आय घटाउँछ। ₨ १,५०,००० मासिक कमाउनेको लागि,
          यी दुईले मात्र वार्षिक करयोग्य आय ₨ ५,००,००० ले घटाउँछ — ₨ १,००,००० भन्दा बढी कर बचत।
        </p>
      </div>
    </>
  )
}

function TipCard({ title, desc, saving, color }: { title: string; desc: string; saving: string; color: string }) {
  return (
    <div className="bg-secondary/40 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-foreground font-medium text-xs">{title}</span>
        <span className={`text-xs font-mono font-semibold ${color}`}>{saving}</span>
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}
