exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "MP_ACCESS_TOKEN no configurado" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON inválido" }) };
  }

  const { items, nombre, telefono, external_reference } = body;

  const preference = {
    items: items.map((item) => ({
      title: item.name,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "ARS",
    })),
    payer: {
      name: nombre,
      phone: { area_code: "", number: telefono },
    },
    back_urls: {
      success: "https://la-buenasemilla.netlify.app/pago-exitoso",
      failure: "https://la-buenasemilla.netlify.app/pago-fallido",
      pending: "https://la-buenasemilla.netlify.app/pago-pendiente",
    },
    auto_return: "approved",
    external_reference: external_reference || `order-${Date.now()}`,
    statement_descriptor: "La Buena Semilla",
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: data }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ init_point: data.init_point }),
  };
};
