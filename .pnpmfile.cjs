module.exports = {
  hooks: {
    readPackage (pkg) {
      if (pkg.peerDependencies['react']) {
        pkg.peerDependencies['react'] = '^18.2.0'
      }
      if (pkg.peerDependencies['react-dom']) {
        pkg.peerDependencies['react-dom'] = '^18.2.0'
      }
      if (pkg.peerDependencies['eslint-plugin-react-hooks']) {
        pkg.peerDependencies['eslint-plugin-react-hooks'] = '^4.6.0'
      }
      return pkg
    }
  }
}