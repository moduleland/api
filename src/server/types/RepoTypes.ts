
export namespace RepoTypes {

    export type Repo = {
        id: string;
        owner: {
            id: string;
            login: string;
            viewerCanAdminister?: boolean;
        }
        name: string;
        description: string;
        homepageURL: string;
        isPrivate: boolean;
        diskUsage: number;
        licenseInfo: {
            name: string;
            spdxId: string;
        };
        primaryLanguage: {
            name: string;
        };
        createdAt: Date;
        pushedAt: Date;
        updatedAt: Date;
        forkCount: number;
        issues: {
            totalCount: number;
        }
        pullRequests: {
            totalCount: number
        }
        stargazers: {
            totalCount: number
        }
        url: string;
        defaultBranchRef: {
            name: string;
            target: {
                oid: string;
            }
        }
        releases: {
            nodes: Array<{
                tagName: string;
                isPrerelease: boolean;
            }>
        }
    }

    export type ViewerRepos = {
        viewer: {
            repositories: {
                totalCount: number;
                nodes: Array<Repo>,
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string
                }
            };
        }
    }

    export type SearchRepo = {
        repository: Repo
    }

    export type SearchRepoRelease = {
        repository: {
            defaultBranchRef: {
                name: string,
                target: {
                    oid: string;
                    abbreviatedOid: string;
                }
            }
            release?: {
                isPrerelease: boolean;
                createdAt: Date;
            }
        }
    }

}
