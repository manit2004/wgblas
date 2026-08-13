CC = nvcc
BIN = bin

all: $(BIN)/dasum $(BIN)/stride.dasum

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dasum: dasum.c ../../utils/helpers.h | $(BIN)
	$(CC) dasum.c -o $(BIN)/dasum -lcublas

$(BIN)/stride.dasum: stride.dasum.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dasum.c -o $(BIN)/stride.dasum -lcublas

clean:
	rm -rf $(BIN)
