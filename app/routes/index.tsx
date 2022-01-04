import { Form, LoaderFunction, useLoaderData } from "remix";
import { FEATURES } from "~/features";
import { getSupportInfo } from "~/getSupportInfo";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/@picocss/pico@latest/css/pico.min.css",
    },
  ];
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const browserQuery = url.searchParams.get("browserQuery");
  const feature = url.searchParams.get("feature");

  if (!browserQuery || !feature) {
    return { error: "Error" };
  }

  const info = getSupportInfo(feature as any, browserQuery);
  return info;
};

export default function Index() {
  const info = useLoaderData();
  const formattedInfo = JSON.stringify(info, null, 2);

  return (
    <main className="container">
      <Form>
        <div className="grid">
          <label>
            Add your browser <code>.browserslistrc</code> here:
            <textarea
              name="browserQuery"
              rows={5}
              defaultValue="defaults"
            ></textarea>
          </label>
          <label>
            Select the feature
            <select name="feature">
              {FEATURES.map((feature) => {
                return (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <button type="submit">Search</button>
      </Form>

      <pre>{formattedInfo}</pre>
    </main>
  );
}
