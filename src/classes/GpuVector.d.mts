/**
 * Represents a Float32Array stored in GPU memory.
 */
export declare class GpuVector {
    /** @internal */
    readonly _buf: GPUBuffer;

    /** Number of elements in the vector. */
    readonly length : number;

    // TODO: widen to Float32ArrayConstructor | Float64ArrayConstructor when Float64 support is added
    /** Typed array constructor used when reading data back from the GPU. */
    readonly dtype : Float32ArrayConstructor;

    /**
     * Uploads a Float32Array to GPU memory.
     *
     * @param data - input vector data
     * @returns GpuVector backed by a GPU buffer
     */
    static from(data: Float32Array): GpuVector;

    /**
     * Reads the vector data back from GPU memory.
     *
     * @returns vector data as a Float32Array
     * TODO: return type will widen to Promise<Float32Array | Float64Array> when Float64 support is added
     */
    read(): Promise<Float32Array>;

    /**
     * Destroys the underlying GPU buffer.
     */
    destroy(): void;
}
