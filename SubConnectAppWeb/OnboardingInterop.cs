using Microsoft.JSInterop;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SubConnectAppWeb
{
  public class OnboardingInterop
  {
    private readonly IJSRuntime _jsRuntime;

    public OnboardingInterop(IJSRuntime jsRuntime)
    {
      _jsRuntime = jsRuntime;
    }

    public async Task Connect()
    {
      await _jsRuntime.InvokeAsync<Task>("interop.connect");
    }
  }
}
