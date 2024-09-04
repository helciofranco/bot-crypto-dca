export const query = `query {
  chain {
    latestBlock {
      header {
        height
      }
    }
  }
}`;
