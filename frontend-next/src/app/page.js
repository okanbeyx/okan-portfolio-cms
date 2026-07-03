import PublicHomeClient from '@/components/PublicHomeClient'
import { getSiteTexts } from '@/services/siteTextsService'

export default async function Home() {
  const siteTexts = await getSiteTexts()

  return (
    <PublicHomeClient initialSiteTexts={siteTexts} />
  )
}