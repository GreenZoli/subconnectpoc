using Microsoft.JSInterop;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SubConnectIntegration
{
  public class SubConnectInterop
  {
    private static SubConnectInterop _instance;
    private readonly IJSRuntime _jsRuntime;
    public SubConnectState State { get; private set; }

    public event Func<SubConnectState, Task> StateChangedEvent;

    public SubConnectInterop Instance
    { get { return _instance; } private set { _instance = (SubConnectInterop)value; } }
    public SubConnectInterop(IJSRuntime jsRuntime)
    {
      _instance = this;
      State = new();
      _jsRuntime = jsRuntime;
    }

    public async Task Connect()
    {
      await _jsRuntime.InvokeAsync<Task>("subConnect.connect");
    }

    public async Task<string> GetAccount()
    {
      return await _jsRuntime.InvokeAsync<string>("subConnect.getAccount");
    }

    public async Task<string> GetSignature(string message)
    {
      return await _jsRuntime.InvokeAsync<string>("subConnect.signMessage", message);
    }

    [JSInvokable()]
    public static async Task StateHasChanged(string? chainId, string? address)
    {
      _instance.State.ChainId = chainId?.ToString();
      _instance.State.Address = address;
      if (_instance.StateChangedEvent != null)
        await _instance.StateChangedEvent.Invoke(_instance.State);
    }
  }
}
