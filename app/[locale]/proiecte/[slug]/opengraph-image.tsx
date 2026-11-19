import { caseOg } from '@/components/case/og'
import { ogSize } from '@/lib/og'

const og = caseOg('ro')

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Studiu de caz · Alex D.'
// Doar slug-urile din generateStaticParams; restul primesc 404, ca pagina.
export const dynamicParams = false
export const generateStaticParams = og.generateStaticParams
export default og.Image
