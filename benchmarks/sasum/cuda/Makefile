CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sasum

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sasum: sasum.c $(HDRS) | $(BIN)
	$(CC) sasum.c -o $(BIN)/sasum -lcublas

clean:
	rm -rf $(BIN)
