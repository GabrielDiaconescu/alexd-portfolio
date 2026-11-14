import { caseRoute } from '@/components/case/route'

const route = caseRoute('en')

export const dynamicParams = false
export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
