CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dsyr2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dsyr2: dsyr2.c $(HDRS) | $(BIN)
	$(CC) dsyr2.c -o $(BIN)/dsyr2 -lcublas

clean:
	rm -rf $(BIN)
