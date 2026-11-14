import { caseOg } from '@/components/case/og'
import { ogSize } from '@/lib/og'

const og = caseOg('ro')

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Studiu de caz · Alex D.'
export const generateStaticParams = og.generateStaticParams
export default og.Image
