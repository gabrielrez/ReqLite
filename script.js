document.addEventListener('DOMContentLoaded', function () {
  const saved_theme = localStorage.getItem('theme');
  if (saved_theme === 'light') {
    document.body.classList.add('light-theme');
  }
});

document.getElementById('themeToggle').addEventListener('click', function () {
  document.body.classList.toggle('light-theme');
  const theme = document.body.classList.contains('light-theme')
    ? 'light'
    : 'dark';
  localStorage.setItem('theme', theme);
});

async function getRequest(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: 'Failed to fetch data' };
  }
}

async function postRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    return { error: 'Failed to post data' };
  }
}

async function putRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating data:', error);
    return { error: 'Failed to update data' };
  }
}

async function deleteRequest(url) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting data:', error);
    return { error: 'Failed to delete data' };
  }
}

function displayResponse(response) {
  const response_view = document.getElementById('responseOutput');
  if (response.error) {
    response_view.innerText = `Error: ${response.error}`;
  } else {
    response_view.innerText = JSON.stringify(response, null, 2);
  }
}

const methods = {
  get: getRequest,
  post: postRequest,
  put: putRequest,
  delete: deleteRequest,
};

document
  .getElementById('requestForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const method = document.getElementById('method-select').value;
    const url = document.getElementById('url').value;
    let params;

    try {
      params = JSON.parse(document.getElementById('params').value || '{}');
    } catch (error) {
      alert('Invalid JSON format in parameters.');
      return;
    }

    console.log('Sending', method, 'request to', url, 'with params:', params);

    const request_function = methods[method];
    if (!request_function) {
      alert('Unsupported HTTP method.');
      return;
    }

    let response;
    if (method === 'get' || method === 'delete') {
      response = await request_function(url);
    } else {
      response = await request_function(url, params);
    }

    displayResponse(response);
    console.log('Response:', response);
    document.getElementById('params').value = '';
  });
