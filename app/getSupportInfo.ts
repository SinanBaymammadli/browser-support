import caniuse from "caniuse-lite";
import browserslist from "browserslist";
import { Feature } from "./features";

interface SupportInfo {
  feature: Feature;
  title: string;
  targetBrowsers: any;
  supportedTargetBrowsers: any;
  unsupportedTargetBrowsers: any;
  isSupported: boolean;
}

function groupBrowsers(browserList: string[][]) {
  return browserList.reduce((acc, cur) => {
    return {
      ...acc,
      [cur[0]]: [...((acc as any)[cur[0]] ?? []), cur[1]],
    };
  }, {});
}

export function getSupportInfo(
  feature: Feature,
  browserQuery: string
): SupportInfo | undefined {
  try {
    const targetBrowsersData = browserslist(browserQuery, {
      ignoreUnknownVersions: true,
    });
    const groupedTargetBrowsers = targetBrowsersData.map((browser) =>
      browser.split(" ")
    );

    const supportedBrowsers = caniuse.feature(caniuse.features[feature]);
    const title = supportedBrowsers.title;

    const targetBrowsers = groupBrowsers(groupedTargetBrowsers);
    const supportedTargetBrowsers = groupBrowsers(
      groupedTargetBrowsers.filter((browser) => {
        return (
          supportedBrowsers.stats[browser[0]] &&
          supportedBrowsers.stats[browser[0]][browser[1]] === "y"
        );
      })
    );
    const unsupportedTargetBrowsers = groupBrowsers(
      groupedTargetBrowsers.filter((browser) => {
        return (
          supportedBrowsers.stats[browser[0]] &&
          supportedBrowsers.stats[browser[0]][browser[1]] !== "y"
        );
      })
    );
    const isSupported = Object.keys(unsupportedTargetBrowsers).length === 0;

    return {
      feature,
      title,
      isSupported,
      unsupportedTargetBrowsers,
      targetBrowsers,
      supportedTargetBrowsers,
    };
  } catch (error) {
    console.log(error);
    // console.log(`Didn't find the feature: ${feature}`);
    // console.log(`Use one of below: ${JSON.stringify(FEATURES, null, 2)}`);
  }
}
