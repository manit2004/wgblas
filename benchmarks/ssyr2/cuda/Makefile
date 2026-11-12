CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/ssyr2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr2: ssyr2.c $(HDRS) | $(BIN)
	$(CC) ssyr2.c -o $(BIN)/ssyr2 -lcublas

clean:
	rm -rf $(BIN)
