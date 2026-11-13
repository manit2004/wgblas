CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssyr2k

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr2k: ssyr2k.c $(HDRS) | $(BIN)
	$(CC) ssyr2k.c -o $(BIN)/ssyr2k -lcublas

clean:
	rm -rf $(BIN)
