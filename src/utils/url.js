const checkPortValidation = (portToCheck, portsPattern) => {
  let output = false;
  portsPattern.split(",").forEach((port) => {
    const portClean = port.trim();
    let rangePort = portClean.split("-");
    if (rangePort.length === 1) {
      rangePort = [rangePort[0], rangePort[0]];
    }
    if (portToCheck <= rangePort[0] && portToCheck >= rangePort[1]) {
      output = true;
      return;
    }
  });

  return output;
};

const getSiteRoot = (url, port, ports) => {
  let result = "";
  if (!ports) {
    return result;
  }
  ports.forEach((patern) => {
    if (checkPortValidation(port, patern.ports)) {
      if (!patern.siteRoots) {
        return;
      }
      patern.siteRoots.forEach((siteRoot) => {
        if (siteRoot === "{%no_site_root%}") {
          result = null;
          return;
        }
        if (url.startsWith(siteRoot)) {
          result = siteRoot;
          return;
        }
      });
    }
  });
  if (result === "") {
    result = url.split("/")[0];
  }
  return result;
};

export const extractPartOfUrl = (inputUrl, ports) => {
  let url = inputUrl;

  const result = {
    scheme: null,
    domain: null,
    port: null,
    siteRoot: null,
    path: null,
    query: null,
  };

  if (!url || url === "") {
    return result;
  }

  if (url.startsWith("http:")) {
    result["scheme"] = "http://";
    url = url.slice(7);
  }
  if (url.startsWith("https:")) {
    result["scheme"] = "https://";
    url = url.slice(8);
  }

  const domainAndPort = url.split("/")[0];
  const domainAndPortList = domainAndPort.split(":");

  result["domain"] = domainAndPortList[0];

  if (domainAndPortList.length > 1) {
    result["port"] = domainAndPortList[1];
  }

  url = url.slice(domainAndPort.length + 1);

  if (result["port"]) {
    result["siteRoot"] = getSiteRoot(url, result["port"], ports);
    if (result["siteRoot"]) {
      url = url.slice(result["siteRoot"].length + 1);
    }
  }

  if (url.length > 1) {
    const pattern = /[#?]/
    const pathQueryList = url.split(pattern);
    result["path"] = pathQueryList[0];

    if (pathQueryList.length > 1) {
      result["query"] = pathQueryList[1];
    }
  }

  return result;
};

export const newUrlGeneration = (url, patern, ports) => {
  if (!url || !patern) {
    return "";
  }

  const urlObj = extractPartOfUrl(url, ports);
  let start = "";
  if (urlObj.scheme) {
    start = start + urlObj.scheme;
  }
  if (urlObj.domain) {
    start = start + urlObj.domain;
  }
  let port = "";
  if (urlObj.port) {
    port = ":" + urlObj.port;
  }
  if (urlObj.siteRoot) {
    port = port + "/" + urlObj.siteRoot;
  }
  if (port !== "") {
    start = start + port;
  }
  if (start === "") {
    start = null;
  }
  const paternMapping = {
    "{%scheme%}": urlObj.scheme,
    "{%domain%}": urlObj.domain,
    "{%port%}": port !== "" ? port : null,
    "{%start%}": start,
    "{%path%}": urlObj.path ? "/" + urlObj.path : null,
    "{%query%}": urlObj.query ? "?" + urlObj.query : null,
  };

  let newUrl = patern;

  Object.keys(paternMapping).forEach((key) => {
    const value = paternMapping[key];

    if (value) {
      newUrl = newUrl.replaceAll(key, value);
    } else {
      newUrl = newUrl.replaceAll(key, "");
    }
  });

  return newUrl;
};
