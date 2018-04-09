
import pytest

from file_server.web.endpoints.active_clients import ActiveClientsEndpoint

import file_server.util

def test_active_clients(path, parts):

    def createConnectionObj(client_host, account_name, transferring=False):
        return createObject({
            "client_host": client_host,
            "account": createObject({"name": account_name}),
            "transferring": transferring,
        })

    connections = [
        createConnectionObj("client host", "account name", True)
    ]

    ActiveClientsEndpoint().handle_request(None, createObject({"connections": connections}), None, None)
    
    assert True