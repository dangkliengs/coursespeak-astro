// GitHub API Client for CourseSpeak
export class GitHubAPI {
  constructor() {
    this.repoOwner = 'dangkliengs';
    this.repoName = 'coursespeak-astro';
    this.filePath = 'src/data/deals.json';
    this.token = null;
  }

  // Set token from user input
  setToken(token) {
    this.token = token;
    // Store in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('github_token', token);
    }
  }

  // Get token from sessionStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('github_token') || this.token;
    }
    return this.token;
  }

  // Get current file from GitHub
  async getCurrentFile() {
    const token = this.getToken();
    if (!token) {
      throw new Error('GitHub token required');
    }

    const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${this.filePath}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: atob(data.content),
      sha: data.sha
    };
  }

  // Update file in GitHub
  async updateFile(newContent, message = 'Update deals') {
    const token = this.getToken();
    if (!token) {
      throw new Error('GitHub token required');
    }

    // Get current file first
    const currentFile = await this.getCurrentFile();
    
    const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${this.filePath}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: message,
        content: btoa(JSON.stringify(newContent, null, 2)),
        sha: currentFile.sha
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${response.status} - ${error.message}`);
    }

    return await response.json();
  }

  // Get all deals
  async getDeals() {
    const file = await this.getCurrentFile();
    return JSON.parse(file.content);
  }

  // Update specific deal
  async updateDeal(dealData) {
    if (!dealData.id) {
      throw new Error('Deal ID is required');
    }

    const currentDeals = await this.getDeals();
    const dealIndex = currentDeals.findIndex(deal => deal.id === dealData.id);

    if (dealIndex === -1) {
      throw new Error('Deal not found');
    }

    // Update deal with timestamp
    currentDeals[dealIndex] = {
      ...currentDeals[dealIndex],
      ...dealData,
      updatedAt: new Date().toISOString()
    };

    // Sort by recency
    const sortedDeals = currentDeals.sort((a, b) => {
      const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
      const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
      return timeB - timeA;
    });

    await this.updateFile(sortedDeals, `Update deal: ${dealData.title || dealData.id}`);
    return sortedDeals[dealIndex];
  }

  // Add new deal
  async addDeal(dealData) {
    if (!dealData.title || dealData.price === undefined) {
      throw new Error('Title and price are required');
    }

    const currentDeals = await this.getDeals();
    
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    currentDeals.unshift(newDeal);
    
    await this.updateFile(currentDeals, `Add new deal: ${newDeal.title}`);
    return newDeal;
  }

  // Delete deal
  async deleteDeal(dealId) {
    if (!dealId) {
      throw new Error('Deal ID is required');
    }

    const currentDeals = await this.getDeals();
    const dealIndex = currentDeals.findIndex(deal => deal.id === dealId);

    if (dealIndex === -1) {
      throw new Error('Deal not found');
    }

    const deletedDeal = currentDeals[dealIndex];
    currentDeals.splice(dealIndex, 1);
    
    await this.updateFile(currentDeals, `Delete deal: ${deletedDeal.title || dealId}`);
    return deletedDeal;
  }
}

// Export singleton instance
export const githubAPI = new GitHubAPI();
