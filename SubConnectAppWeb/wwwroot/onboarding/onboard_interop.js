window.interop = {

  connect: async () => {
    return await onboard.connectWallet()
  },

  disconnect: () => {
    onboard.disconnectWallet({ label })
  },

  addConnectedInfo: connectedAccount => {
    const address = connectedAccount.address
    const start = address.slice(0, 5)
    const end = address.slice(-5, -1)
    $address.innerHTML = `${start}.....${end}`
    $label.innerHTML = `Connected Wallet: ${label}`
  }
}

//$connect.addEventListener('click', async _ => {
//  const wallets = await connect()
//  if (wallets[0]) {
//    const connectedAccount = wallets[0].accounts[0]
//    label = wallets[0].label
//    addConnectedInfo(connectedAccount)
//  }
//})

//$disconnect.addEventListener('click', _ => {
//  disconnect()
//  $wallet.classList.add('hidden')
//  $disconnected.classList.remove('hidden')
//})
