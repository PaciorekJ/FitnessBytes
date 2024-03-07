
import ClientService, { ResponseResult } from "./ClientService";

class EndpointFactory<ParentResponse> {
    private client: ClientService<ParentResponse> | undefined;
    private res: ResponseResult<ParentResponse> | undefined;

    constructor(private endpoint: string) {}

    get<GetResponse>(path: string = "/") {
        return async (id: string = ""): Promise<GetResponse | undefined> => {
            this.client = new ClientService<ParentResponse>(`${this.endpoint}${path}${id}`);
    
            try {
                this.res = await this.client.get();
            } catch {
                return undefined;
            }
    
            return this.client.checkResponse(this.res) as GetResponse;
        }
    }

    delete<DeleteResponse>(path: string = "/") {
        return async (id: string): Promise<DeleteResponse | undefined> => {
            this.client = new ClientService<ParentResponse>(`${this.endpoint}${path}${id}`);
    
            try {
                this.res = await this.client.delete();
            } catch {
                return undefined;
            }
    
            return this.client.checkResponse(this.res) as DeleteResponse;
        }
    }

    post<PostResponse, T>(path: string = "/") {
        return async (postContent: Partial<T>): Promise<PostResponse | undefined> => {
            this.client = new ClientService<ParentResponse>(`${this.endpoint}${path}`);
    
            try {
                this.res = await this.client.post(postContent);
            } catch {
                return undefined;
            }
    
            return this.client.checkResponse(this.res) as PostResponse;
        }
    }

    patch<PatchResponse, T>(path: string = "/") {
        return async (patchContent: Partial<T>): Promise<PatchResponse | undefined> => {
            this.client = new ClientService<ParentResponse>(`${this.endpoint}${path}`);
    
            try {
                this.res = await this.client.patch(patchContent);
            } catch {
                return undefined;
            }
    
            return this.client.checkResponse(this.res) as PatchResponse;
        }
    }
}

export default EndpointFactory;