import { StripePricingTable } from "@/components/stripe-pricing-table"
import { CodeBlock } from "@/components/code-block"
import { Badge } from "@/components/ui/badge"
import { PageFooter } from "@/components/page-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation - NACE-BEL 2025",
  description:
    "Complete API documentation for the NACE-BEL 2025 classification system. Access economic activity codes programmatically with our REST API.",
  openGraph: {
    title: "API Documentation - NACE-BEL 2025",
    description:
      "Complete API documentation for the NACE-BEL 2025 classification system. Access economic activity codes programmatically with our REST API.",
    type: "website",
  },
}

export default function ApiDocsPage() {
  const listResponseExample = `{
  "data": [
    {
      "level": 2,
      "code": "01.1",
      "titles": {
        "en": "Growing of non-perennial crops",
        "de": "Anbau von einjährigen Pflanzen",
        "fr": "Cultures non permanentes",
        "nl": "Teelt van eenjarige gewassen"
      },
      "description": { "en": "", "de": "", "fr": "", "nl": "" }
    }
  ],
  "totalPages": 25,
  "totalItems": 2458
}`

  const detailResponseExample = `{
  "level": 4,
  "code": "01.11",
  "titles": {
    "en": "Growing of cereals (except rice), leguminous crops and oil seeds",
    "de": "Anbau von Getreide (ohne Reis), Hülsenfrüchten und Ölsaaten",
    "fr": "Culture de céréales (à l'exception du riz), de légumineuses et de graines oléagineuses",
    "nl": "Teelt van granen (met uitzondering van rijst), peulgewassen en oliehoudende zaden"
  },
  "description": { "en": "", "de": "", "fr": "", "nl": "" },
  "childrenCodes": [
    "01.111",
    "01.112",
    "01.113",
    "01.119"
  ]
}`

  const notFoundResponseExample = `{
  "error": "NACEBEL code not found."
}`

  return (
    <div className="bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">NACE-BEL 2025 API Documentation</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Access the complete NACEBEL 2025 classification system programmatically.
          </p>
        </header>

        <section id="authentication">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Authentication</h2>
          <p className="text-muted-foreground">
            An API key is required to use the NACE-BEL 2025 API. You can obtain a key by subscribing to one of our plans
            below. All API requests must include the API key in the{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm">Authorization</code> header as a Bearer token.
          </p>
          <CodeBlock>{`Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
        </section>

        <section id="endpoints">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">API Endpoints</h2>
          <div className="space-y-8">
            {/* Endpoint 1: List & Search */}
            <div>
              <h3 className="text-xl font-semibold mb-2">List & Search Codes</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  GET
                </Badge>
                <code className="text-sm font-mono">/api/v1/nacebel-codes/2025</code>
              </div>
              <p className="text-muted-foreground mb-4">
                Retrieve a paginated list of all NACEBEL codes, or search for codes based on a query.
              </p>

              <h4 className="font-semibold mb-2">Query Parameters</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2">Parameter</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono">q</td>
                      <td className="p-2 font-mono">string</td>
                      <td className="p-2">Search query for code or description. If omitted, returns all codes.</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">page</td>
                      <td className="p-2 font-mono">number</td>
                      <td className="p-2">
                        Page number for pagination. Default: <code className="text-xs">1</code>.
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">limit</td>
                      <td className="p-2 font-mono">number</td>
                      <td className="p-2">
                        Number of items per page. Default: <code className="text-xs">100</code>, Max:{" "}
                        <code className="text-xs">500</code>.
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono">level</td>
                      <td className="p-2 font-mono">number</td>
                      <td className="p-2">Minimum NACEBEL level to include (2-5).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-semibold mt-4 mb-2">Example Request (Search)</h4>
              <CodeBlock>{`curl "https://your-domain.com/api/v1/nacebel-codes/2025?q=software&level=4"`}</CodeBlock>

              <h4 className="font-semibold mt-4 mb-2">Example Response</h4>
              <CodeBlock>{listResponseExample}</CodeBlock>
            </div>

            {/* Endpoint 2: Get Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Code Details</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  GET
                </Badge>
                <code className="text-sm font-mono">/api/v1/nacebel-codes/2025/{"{id}"}</code>
              </div>
              <p className="text-muted-foreground mb-4">
                Retrieve the full details for a single NACEBEL code, including its direct children. The{" "}
                <code className="bg-muted px-1 py-0.5 rounded-sm">{"{id}"}</code> should be the code without any dots
                (e.g., <code className="bg-muted px-1 py-0.5 rounded-sm">0111</code>).
              </p>

              <h4 className="font-semibold mt-4 mb-2">Example Request</h4>
              <CodeBlock>{`curl "https://your-domain.com/api/v1/nacebel-codes/2025/0111"`}</CodeBlock>

              <h4 className="font-semibold mt-4 mb-2">Example Response</h4>
              <CodeBlock>{detailResponseExample}</CodeBlock>

              <h4 className="font-semibold mt-4 mb-2">Example Not Found Response</h4>
              <CodeBlock>{notFoundResponseExample}</CodeBlock>
            </div>
          </div>
        </section>

        <section id="rate-limiting">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Rate Limiting</h2>
          <p className="text-muted-foreground">
            API access is rate-limited to ensure fair usage. The specific limits depend on your subscription plan.
            Exceeding the rate limit will result in a{" "}
            <code className="bg-muted px-1 py-0.5 rounded-sm">429 Too Many Requests</code> error.
          </p>
        </section>
      </div>

      {/* Pricing section with full width */}
      <section id="pricing" className="bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Get Your API Key</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your needs and start accessing the NACE-BEL 2025 API today.
            </p>
          </div>
          <StripePricingTable />
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
