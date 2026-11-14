import { caseOg } from '@/components/case/og'
import { ogSize } from '@/lib/og'

const og = caseOg('en')

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Case study · Alex D.'
export const generateStaticParams = og.generateStaticParams
export default og.Image
