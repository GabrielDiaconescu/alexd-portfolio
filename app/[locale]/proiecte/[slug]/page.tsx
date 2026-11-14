import { caseRoute } from '@/components/case/route'

const route = caseRoute('ro')

export const dynamicParams = false
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
