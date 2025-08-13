import Fetcher from '@service/fetcher';

export default class ViewAPI extends Fetcher {
  protected group: string = '/admin';

  protected metricsGroup: string = `${this.group}/metrics`;
  
  protected countGroup: string = `${this.metricsGroup}/count`;
  protected growthGroup: string = `${this.metricsGroup}/growth`;
  protected topNGroup: string = `${this.metricsGroup}/top-n`;

  /**
   * Lists user accounts.
   * @param page The page number to retrieve.
   * @param page_size The number of accounts per page.
   * @returns A promise that resolves to the list of accounts.
   */
  async listAccounts(page: number, page_size: number) {
    return this.request<{ accounts: Partial<User>[]; count: number }>(
      `${this.group}/accounts?page=${page}&page_size=${page_size}`,
    );
  }

  /**
   * Changes the role of a user account.
   * @param account_id The ID of the account to modify.
   * @param new_role_id The ID of the new role to assign.
   * @returns A promise that resolves to the success status of the operation.
   */
  async changeRole(account_id: string, new_role_id: string) {
    return this.request<{ success: boolean }>(
      `${this.group}/accounts/change-role`,
      {
        method: 'PATCH',
        body: JSON.stringify({ role_id: new_role_id }),
      },
    );
  }

  /**
   * Disables a user account.
   * @param account_id The ID of the account to disable.
   * @returns A promise that resolves to the success status of the operation.
   */
  async disableAccount(account_id: string) {
    return this.request<{ success: boolean }>(
      `${this.group}/accounts/disable`,
      {
        method: 'PATCH',
        body: JSON.stringify({ account_id }),
      },
    );
  }

  /**
   * Creates a new section.
   * @param request The section data to create.
   * @returns A promise that resolves to the created Section object.
   */
  async createSection(request: Section) {
    return this.request(`${this.group}/sections`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Deletes a section by ID.
   * @param sectionId The ID of the section to delete.
   * @returns A promise that resolves to the deleted Section object.
   */
  async deleteSection(sectionId: string) {
    return this.request(`${this.group}/sections/${sectionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Creates a new genre.
   * @param request The genre data to create.
   * @returns A promise that resolves to the created Genre object.
   */
  async createGenre(request: Genre) {
    return this.request(`${this.group}/genres`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Deletes a genre by ID.
   * @param genreId The ID of the genre to delete.
   * @returns A promise that resolves to the deleted Genre object.
   */
  async deleteGenre(genreId: string) {
    return this.request(`${this.group}/genres/${genreId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Creates a new contract.
   * @param request The contract data to create.
   * @returns A promise that resolves to the created Contract object.
   */
  async createCContract(request: Contract) {
    return this.request(`${this.group}/contracts`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Deletes a contract by ID.
   * @param contractId The ID of the contract to delete.
   * @returns A promise that resolves to the deleted Contract object.
   */
  async deleteContract(contractId: string) {
    return this.request(`${this.group}/contracts/${contractId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Creates a new gate.
   * @param request The gate data to create.
   * @returns A promise that resolves to the created Gate object.
   */
  async createGate(request: Gate) {
    return this.request(`${this.group}/gates`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Deletes a gate by ID.
   * @param gateId The ID of the gate to delete.
   * @returns A promise that resolves to the deleted Gate object.
   */
  async deleteGate(gateId: string) {
    return this.request(`${this.group}/gates/${gateId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Retrieves a gate by ID.
   * @param gateId The ID of the gate to retrieve.
   * @returns A promise that resolves to the Gate object.
   */
  async getGate(gateId: string) {
    return this.request<Gate>(`${this.group}/gates/${gateId}`, {
      method: 'GET',
    });
  }

  /**
   * Retrieves a list of gates.
   * @returns A promise that resolves to an array of Gate objects.
   */
  async getGates() {
    return this.request<Gate[]>(`${this.group}/gates`, {
      method: 'GET',
    });
  }

  async accountCount(request: AccountMetricFilter) {
    return this.request<number>(`${this.countGroup}/account`, {
        method: 'POST',
        body: JSON.stringify(request)
    })
  }
  
  async walletCount(request: WalletMetricFilter) {
    return this.request<number>(`${this.countGroup}/wallet`, {
        method: 'POST',
        body: JSON.stringify(request)
    })
  }

  async topicCount(request: TopicMetricFilter) {
    return this.request<number>(`${this.countGroup}/topic`, {
        method: 'POST',
        body: JSON.stringify(request)
    })
  }
}
