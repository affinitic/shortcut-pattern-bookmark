const portPatern = [
  {
    "from":8080,
    "to": 8089,
    'siteRoots': ["plone", "Plone"]
  },
  {
    "from":3000,
    "to": 3000,
    'siteRoots': null
  }
]

const getSiteRoot = (url, port) => {
  let result = "";
  portPatern.forEach((patern) => {
    if (port >= patern.from && port <= patern.to) {
      if (!patern.siteRoots) {
        result = null;
        return;
      }
      patern.siteRoots.forEach((siteRoot)=>{
        if (url.startsWith(siteRoot)) {
          result = siteRoot;
          return;
        }
        result = url.split("/")[0];
        return;
      })
      return;
    }
  })
  return result;
}

export const extractPartOfUrl = (inputUrl) => {
  let url = inputUrl;

  const result = {
    scheme : null,
    domain: null,
    port: null,
    siteRoot: null,
    path: null,
    query: null,
  };

  if (!url || url === "") {
    return result;
  }

  if (url.startsWith('http:')){
    result['scheme'] = 'http://';
    url = url.slice(7);
  }
  if (url.startsWith('https:')){
    result['scheme'] = 'https://';
    url = url.slice(8);
  }

  const domainAndPort = url.split('/')[0];
  const domainAndPortList = domainAndPort.split(':');

  result["domain"] = domainAndPortList[0];

  if (domainAndPortList.length > 1) {
    result["port"] = domainAndPortList[1];
  }
  
  url = url.slice(domainAndPort.length + 1);

  if (result["port"]) {
    result["siteRoot"] = getSiteRoot(url, result["port"]);
    console.log("🚀 ~ file: url.js:66 ~ extractPartOfUrl ~ getSiteRoot(url, result[port]):", getSiteRoot(url, result["port"]))
    if (result["siteRoot"]) {
      url = url.slice(result["siteRoot"].length + 1);
    }
  }

  if (url.length > 1) {
    const pathQueryList = url.split("?");
    result["path"] = pathQueryList[0];

    if (pathQueryList.length > 1) {
      result["query"] = pathQueryList[1];
    }
  }

  return result;

}

export const newUrlGeneration = (url, patern) => {

  if (!url || !patern) {
    return "";
  }
  
  const urlObj = extractPartOfUrl(url);
  let start = "";
  if (urlObj.scheme) {
    start = start + urlObj.scheme;
  }
  if (urlObj.domain) {
    start = start + urlObj.domain;
  }
    if (urlObj.port) {
    start = start + ':' + urlObj.port + '/' + urlObj.siteRoot;
  }
  if (start === '') {
    start = null;
  }
  const paternMapping = {
    "{%scheme%}" : urlObj.scheme,
    "{%domain%}" : urlObj.domain,
    "{%port%}": urlObj.port ? ":" + urlObj.port + "/" + urlObj.siteRoot : null,
    "{%start%}": start,
    "{%path%}": urlObj.path ? '/' + urlObj.path : null,
    "{%query%}": urlObj.query ? '?' + urlObj.query : null
  }

  let newUrl = patern;

  Object.keys(paternMapping).forEach(key => {
    const value = paternMapping[key]

    if (value) {
      newUrl = newUrl.replaceAll(key,value)
    } else {
      newUrl = newUrl.replaceAll(key,'')
    }
  })
  
  return newUrl;

} 
