export async function payNow(orderId: string): Promise<{ url: string }> {
    const res = await fetch(`/api/account/orders/${orderId}/pay`, {
      method: "POST",
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || "Unable to continue payment.");
    }
  
    if (!data.url) {
      throw new Error("Missing payment URL");
    }
  
    return { url: data.url };
  }
  