CC = nvcc
BIN = bin

all: $(BIN)/sasum $(BIN)/stride.sasum

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sasum: sasum.c ../../utils/helpers.h | $(BIN)
	$(CC) sasum.c -o $(BIN)/sasum -lcublas

$(BIN)/stride.sasum: stride.sasum.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sasum.c -o $(BIN)/stride.sasum -lcublas

clean:
	rm -rf $(BIN)
