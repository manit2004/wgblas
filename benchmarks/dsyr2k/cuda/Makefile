CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsyr2k

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsyr2k: dsyr2k.c $(HDRS) | $(BIN)
	$(CC) dsyr2k.c -o $(BIN)/dsyr2k -lcublas

clean:
	rm -rf $(BIN)
