import { termsRoute } from '@/components/legal/terms'

const route = termsRoute('en')

export const generateMetadata = route.generateMetadata
export default route.Page
